using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartHomeAPI2._0.Data;
using SmartHomeAPI2._0.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeAPI2._0.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly SmartHomeContext _context;
        private readonly ILogger<DeviceController> _logger;

        public DeviceController(SmartHomeContext context, ILogger<DeviceController> logger)
        {
            _context = context;
            _logger = logger; // Injecting logger
        }

        // GET: api/device
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Device>>> GetDevices()
        {
            try
            {
                var devices = await _context.Devices.ToListAsync();

                // Apply scheduling logic to each device
                foreach (var device in devices)
                {
                    device.Status = IsDeviceOnBasedOnSchedule(device);
                }

                return Ok(devices); // Return devices with a 200 OK status
            }
            catch (Exception ex)
            {
                return HandleError("Error retrieving devices", ex);
            }
        }

        // GET: api/device/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Device>> GetDevice(int id)
        {
            try
            {
                var device = await _context.Devices.FindAsync(id);
                if (device == null)
                {
                    return NotFound(); // Return 404 if not found
                }

                // Apply scheduling logic to the retrieved device
                device.Status = IsDeviceOnBasedOnSchedule(device);


                return Ok(device); // Return the device with a 200 OK status
            }
            catch (Exception ex)
            {
                return HandleError($"Error retrieving device with ID {id}", ex);
            }
        }

        // POST: api/device
        [HttpPost]
        public async Task<ActionResult<Device>> CreateDevice([FromBody] Device device)
        {
            if (!ModelState.IsValid) // Check if the model is valid
            {
                return BadRequest(ModelState); // Return validation errors
            }

            try
            {
                // Automatically set Status based on the current time and schedule
                device.Status = IsDeviceOnBasedOnSchedule(device);

                _context.Devices.Add(device);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetDevice), new { id = device.DeviceId }, device); // Return 201 Created
            }
            catch (Exception ex)
            {
                return HandleError("Error creating device", ex);
            }
        }

        // PUT: api/device/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, [FromBody] Device device)
        {
            if (id != device.DeviceId)
            {
                return BadRequest("Device ID mismatch"); // Return 400 for ID mismatch
            }

            if (!ModelState.IsValid) // Check if the model is valid
            {
                return BadRequest(ModelState); // Return validation errors
            }

            try
            {
                var existingDevice = await _context.Devices.FindAsync(id);
                if (existingDevice == null)
                {
                    return NotFound(); // Return 404 if device does not exist
                }

                // Update the properties of the existing device
                existingDevice.Name = device.Name;
                existingDevice.StartTime = device.StartTime;
                existingDevice.EndTime = device.EndTime;
                existingDevice.Status = device.Status; // Ensure status is updated
                existingDevice.ownerId = device.ownerId;
                existingDevice.isActive = device.isActive;

                // Mark the entity as modified
                _context.Entry(existingDevice).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent(); // Return 204 No Content on success
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceExists(id))
                {
                    return NotFound(); // Return 404 if device does not exist
                }
                return HandleError($"Concurrency error while updating device ID {id}", null);
            }
            catch (Exception ex)
            {
                return HandleError("Error updating device", ex);
            }
        }

        // DELETE: api/device/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            try
            {
                var device = await _context.Devices.FindAsync(id);
                if (device == null)
                {
                    return NotFound(); // Return 404 if not found
                }

                _context.Devices.Remove(device);
                await _context.SaveChangesAsync();
                return NoContent(); // Return 204 No Content on success
            }
            catch (Exception ex)
            {
                return HandleError("Error deleting device", ex);
            }
        }
        // PUT: api/device/update-all
        [HttpPut("update-all")]
        public async Task<IActionResult> UpdateAllDevices()
        {
            try
            {
                var devices = await _context.Devices.ToListAsync();

                // Update the status of each device based on its schedule
                foreach (var device in devices)
                {
                    device.Status = IsDeviceOnBasedOnSchedule(device);
                    _context.Entry(device).State = EntityState.Modified; // Mark the device as modified
                }

                await _context.SaveChangesAsync(); // Save all changes at once
                return NoContent(); // Return 204 No Content on success
            }
            catch (Exception ex)
            {
                return HandleError("Error updating all devices", ex);
            }
        }


        // Helper method to check if the device should be on based on its schedule
        private bool IsDeviceOnBasedOnSchedule(Device device)
        {
            var currentTime = DateTime.Now.TimeOfDay;

            if (device.StartTime != default && device.EndTime != default && device.isActive)
            {
                // Case 1: Start time is less than end time (same day scheduling)
                if (device.StartTime < device.EndTime)
                {
                    return currentTime >= device.StartTime && currentTime <= device.EndTime;
                }
                else // Case 2: Start time is greater than end time (crosses midnight)
                {
                    return currentTime >= device.StartTime || currentTime <= device.EndTime;
                }
            }

            return false; // Default to off if no schedule is set
        }


        private bool DeviceExists(int id)
        {
            return _context.Devices.Any(e => e.DeviceId == id);
        }

        // Utility method for handling errors
        private ActionResult HandleError(string message, Exception ex)
        {
            _logger.LogError(ex, message); // Log the error
            return StatusCode(500, "Internal server error"); // Return 500 on failure
        }
    }
}
