using HisBloodbankEf.Core.Enum;
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
        //public static List<ReactionTypeVm> MapReactionTypeToVm(List<ReactionType> objs)
        //{
        //    var vmList = new List<ReactionTypeVm>();
        //    foreach (var obj in objs)
        //    {
        //        vmList.Add(MapReactionTypeToVm(obj));
        //    }
        //    return vmList;
        //}

        //public static ReactionTypeVm MapReactionTypeToVm(ReactionType obj)
        //{
        //    var vm = new ReactionTypeVm()
        //    {
        //        Id = obj.Id.ToString(),
        //        Active = obj.Active,
        //        Arabic = obj.Arabic,
        //        CreatedAt = obj.CreatedAt.ToString(dateFormat),
        //        CreatedBy = obj.CreatedBy,
        //        ImgLink = obj.ImgLink,
        //        ModifiedAt = obj.ModifiedAt.HasValue ? obj.ModifiedAt.Value.ToString(dateFormat) : "",
        //        ModifiedBy = obj.ModifiedBy,
        //        Name = obj.Name
        //    };
        //    return vm;
        //}

        //public static Feedback MapReactionTypeToVm(FeedbackVm obj)
        //{
        //    var branch = new Branch() { Code = obj.BranchCode };
        //    var vm = new Feedback()
        //    {
        //        Active = obj.Active,
        //        Branch = branch,
        //        CreatedAt = DateTime.Now,
        //        CreatedBy = obj.StationId.ToString(),
        //        IpAddress = obj.IpAddress,
        //        ReactionId = obj.ReactionId,
        //        RegistrationNo = "",
        //        StationId = obj.StationId
        //    };
        //    return vm;
        //}
    }
}
