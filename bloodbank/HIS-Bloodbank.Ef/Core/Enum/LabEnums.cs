using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Enum
{
    public enum RangeAgetype
    {
        [Description("Days")]
        Days = 1,
        [Description("Months")]
        Months = 2,
        [Description("Years")]
        Years = 1
    }

    public enum GenderEnum
    {
        [Description("Female")]
        Female = 1,
        [Description("Male")]
        Male = 2
    }

    public enum BloodGroup
    {
        [Description("A+ve")]
        AplusVe = 1,
        [Description("A-ve")]
        AminusVe = 2,
        [Description("B+ve")]
        BplusVe = 3,
        [Description("B-ve")]
        BminusVe = 4,
        [Description("O+ve")]
        OplusVe = 5,
        [Description("O-ve")]
        OminusVe = 6,
        [Description("AB+ve")]
        ABplusVe = 7,
        [Description("AB-ve")]
        ABminusVe = 8
    }
}
