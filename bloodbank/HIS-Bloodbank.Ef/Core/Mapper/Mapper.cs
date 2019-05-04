using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Core.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Mapper
{
    public static partial class Mapper
    {
        private static string dateFormat = "dd-MMM-yyyy hh:mm tt";

        //public static List<SelectVm> MapBranchToSelectVm(List<Branch> objs)
        //{
        //    var vmList = new List<SelectVm>();
        //    foreach (var obj in objs)
        //    {
        //        vmList.Add(MapBranchToSelectVm(obj));
        //    }
        //    return vmList;
        //}

        //public static SelectVm MapBranchToSelectVm(Branch obj)
        //{
        //    var vm = new SelectVm()
        //    {
        //        Id = obj.Id.ToString(),
        //        Name = obj.Code + " - " + obj.Name
        //    };
        //    return vm;
        //}

    }
}
