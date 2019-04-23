using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreOpChartEvaluation :BaseModel
    {
        public int Id { get; set; }
        public virtual int PreOperativeChartId { get; set; }
        //yes/no ,n/a
        public bool? IsCorrect { get; set; }

        public virtual PreOperativeChart Chart { get; set; }



    }
}
