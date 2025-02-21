using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class Warehouse
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public float FillPercentage { get; set; }
        public string DisplayFillPercentage => $"{FillPercentage}% Full";
    }
}
