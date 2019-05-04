namespace HisBloodbankEf.Infra.Migrations
{
    using HisBloodbankEf.Core.Model;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<HisBloodbankEf.Infra.HisBloodbankDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(HisBloodbankEf.Infra.HisBloodbankDbContext context)
        {

           
        }
    }
}
