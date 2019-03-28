using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Models;
using System.Net;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Portfolio.Controllers
{
    public class HomeController : Controller
    {
        private IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        [HttpPost]
        public async Task Index(Email email)
        {
            if (ModelState.IsValid)
            {
                email.CreatedDate = DateTime.Now;

                var body = "<h3>Thank you for contacting Brian Harney!</h3><p>{0}, <br/>I appreciate you reaching out. I am always looking to build new relationships and take on new projects. Please contact me if you have any questions, or just want to keep in touch! <br/><br/>Please see the message you sent to me through my website,<a href=&quot;www.bharney.com&quot;>BHarney.com</a>, below: <br/>Name: {1} <br/>Email: {2} <br/>Phone: {3} <br/>Message: {4}</p><Thank you for contacting me!<br/> Give me a call at (630)849-6948 or email me at <br/><br/>Kind Regards, <br/>Brian Harney";
                var client = new SendGridClient(_configuration["SendGrid"]);
                var message = new SendGridMessage();
                message.SetFrom(new EmailAddress(_configuration["Sender"]));
                var recipients = new List<EmailAddress>
                {
                new EmailAddress(email.Name,"bharney0@gmail.com"),
                new EmailAddress(email.Name, email.EmailAddress)
                };
                message.AddTos(recipients);
                message.SetSubject("Thank you for contacting Brian Harney!");
                message.AddContent(MimeType.Html, string.Format(body, email.Name, email.Name, email.EmailAddress, email.Phone, email.Message));
                //message.HtmlBody = true;

                var response = await client.SendEmailAsync(message);
            }
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
