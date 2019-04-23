using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Enum
{
    public enum PatientCaseType
    {
        [Description("Allergy for drugs and foods etc.")]
        FoodAndDrugs = 100,
        [Description("Diabetis")]
        Diabetis = 101,
        [Description("Hypertension")]
        Hypertension = 102,
        [Description("Cardiac Desease")]
        CardiacDesease = 103,
        [Description("Hyper Lipedema")]
        HyperLipedema = 104,
        [Description("Operations oral anticoagulants dose")]
        OperationsOralAnticoagulantsDose = 105
    }


    public enum SedationType
    {
        [Description("Elective")]
        ELECTIVE = 1,
        [Description("Urgent")]
        URGENT = 2,
        [Description("Emergency")]
        EMERGENCY = 3,
        [Description("Reoperative")]
        REOPERATIVE = 4
    }
}
