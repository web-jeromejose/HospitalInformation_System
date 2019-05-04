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
        //public static List<BranchVm> MapBranchToVm(List<Branch> objs)
        //{
        //    var vmList = new List<BranchVm>();
        //    foreach (var obj in objs)
        //    {
        //        vmList.Add(MapBranchToVm(obj));
        //    }
        //    return vmList;
        //}

        //public static BranchVm MapBranchToVm(Branch obj)
        //{
        //    var vm = new BranchVm()
        //    {
        //        Id = obj.Id.ToString(),
        //        Active = obj.Active,
        //        Code = obj.Code,
        //        Address = obj.Address,
        //        CreatedAt = obj.CreatedAt.ToString(dateFormat),
        //        CreatedBy = obj.CreatedBy,
        //        ModifiedAt = obj.ModifiedAt.HasValue ? obj.ModifiedAt.Value.ToString(dateFormat) : "",
        //        ModifiedBy = obj.ModifiedBy,
        //        Name = obj.Name,
        //        BackColor = obj.BackColor,
        //        HoverColor = obj.HoverColor
        //    };
        //    return vm;
        //}
    }
}
