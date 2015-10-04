using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.DependencyInjection;
//using Microsoft.AspNet.FileSystems;

namespace TimeSchedule
{
    public class Startup
    {
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app)
        {
            // to use static files
            // https://wipdeveloper.com/2015/04/02/asp-net-5-and-static-files/
            //app.UseStaticFiles();
            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World!");
            //});
            
            app.UseFileServer(new FileServerOptions()
            {
                EnableDirectoryBrowsing = true,
                //FileSystem = new PhysicalFileSystem("/")
            });
        }
    }
}
