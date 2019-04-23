using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class OTUnitOfMeasurement : BaseModel
    {

        public OTUnitOfMeasurement()
        {
        }
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
