using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace Flux_ver2.Models
{
    public class CustomerAddress
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
    }
}
