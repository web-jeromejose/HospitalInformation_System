namespace HIS_ITADMIN_EF.Infra.Migrations
{
    using HIS_ITADMIN_EF.Core.Model;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<HIS_ITADMIN_EF.Infra.HIS_ITADMIN_EFDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        //protected override void Seed(HIS_ITADMIN_EF.Infra.HIS_ITADMIN_EFDbContext context)
        //{

        //    var reaction = context.Reaction.Find(1);
        //    if (reaction == null)
        //    {
        //        var reactionExcellent = new ReactionType()
        //        {
        //            Name = "Excellent",
        //            Arabic = "ممتاز",
        //            ImgLink = "/Images/Emoji-Happy-icon.png",
        //            CreatedBy = "Seed",
        //            BackColor = "#2ecc71",
        //            HoverColor = "#2ecc71"
        //        };
        //        var reactionGood = new ReactionType()
        //        {
        //            Name = "Good",
        //            Arabic = "جيد",
        //            ImgLink = "/Images/Emoji-Helpful-icon.png",
        //            CreatedBy = "Seed",
        //            BackColor = "#3498db",
        //            HoverColor = "#3498db"
        //        };
        //        var reactionAverage = new ReactionType()
        //        {
        //            Name = "Average",
        //            Arabic = "عادي",
        //            ImgLink = "/Images/Emoji-Sadistic-icon.png",
        //            CreatedBy = "Seed",
        //            BackColor = "#2c3e50",
        //            HoverColor = "#2c3e50"
        //        };
        //        var reactionPoor = new ReactionType()
        //        {
        //            Name = "Poor",
        //            Arabic = "غير راضي",
        //            ImgLink = "/Images/Emoji-Hopeless-icon.png",
        //            CreatedBy = "Seed",
        //            BackColor = "#d35400",
        //            HoverColor = "#d35400"
        //        };

        //        var branch = new Branch()
        //        {
        //            Name = "Jeddah",
        //            Code = "SA01",
        //            Address = "Location",
        //            CreatedBy = "Seed",
        //            BackColor = "#36A2EB",
        //            HoverColor = "#36A2EB"
        //        };

        //        var dept = new Area()
        //        {
        //            Name = "Information Technology Department",
        //            Code = "IT Dept",
        //            Branch = branch,
        //            CreatedBy = "Seed",
        //            BackColor = "#36A2EB",
        //            HoverColor = "#36A2EB"
        //        };

        //        var stat = new Station()
        //        {
        //            Name = "Developer Team 1",
        //            Code = "Dev Team 1",
        //            IpAddress = "::1",
        //            Area = dept,
        //            CreatedBy = "Seed"
        //        };

        //        context.Branch.Add(branch);
        //        context.Area.Add(dept);
        //        context.Station.Add(stat);
        //        context.Reaction.Add(reactionExcellent);
        //        context.Reaction.Add(reactionGood);
        //        context.Reaction.Add(reactionAverage);
        //        context.Reaction.Add(reactionPoor);
        //        context.SaveChanges();
        //    }
        //}
    }
}
