using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FabricJSDrawingWalkthrough
{
    public class DrawingModel : PageModel
    {
        [BindProperty]
        public string DrawingContent { get; set; }

        public void OnGet()
        {

        }

        public IActionResult OnPostSave()
        {
            var drawingJson = DrawingContent;
            return new JsonResult(new { Valid = true });
        }
    }
}