
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.EntityClient;
using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Core.Helper;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace HisBloodbankEf.Infra
{
    public class HisBloodbankDbContext : DbContext
    {

        public HisBloodbankDbContext()
            : base("SghDbContextConnString")
        {
            //string encrypted = System.Configuration.ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ToString();
            //string decrypted = Cypher.Decrypt(encrypted, true);
            //Database.Connection.ConnectionString = decrypted;
            //Database.CreateIfNotExists();
        }

        public DbSet<BloodDonor> Donor { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BloodDonor>().ToTable("Donor", "Bloodbank");
        }

    }
}
