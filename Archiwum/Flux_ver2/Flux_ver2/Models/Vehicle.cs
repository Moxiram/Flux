using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class Vehicle
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string RegistrationNumber { get; set; }
        public string Type { get; set; } // Example: "Truck", "Van"
        public double Capacity { get; set; } // Capacity in kilograms or cubic meters
    }
}
