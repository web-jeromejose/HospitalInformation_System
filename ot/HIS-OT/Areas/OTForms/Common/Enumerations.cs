using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Common
{
    public enum PainScore
    {
        NOPAIN = 0,
        MILDPAIN =2, 
        MODERATEPAIN = 4,
        SEVEREPAIN = 6,
        VERYSEVEREPAIN =8,
        WORSTPAINPOSSIBLE = 10
    }

    public enum SedationType
    {
        ELECTIVE = 1,
        URGENT = 2,
        EMERGENCY = 3,
        REOPERATIVE = 4
    }
}