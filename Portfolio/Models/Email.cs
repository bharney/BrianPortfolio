using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portfolio.Models
{
    public class Email
    {
        public int EmailID { get; set; }
        public string Name { get; set; }
        public string EmailAddress { get; set; }
        public string Phone { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public string Message { get; set; }
    }
}

