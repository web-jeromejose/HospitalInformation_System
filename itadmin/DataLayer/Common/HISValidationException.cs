using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer
{
    public class HISValidationException : Exception
    {
        public HISValidationException(string message) : base(message)
        {
        }
    }
}
