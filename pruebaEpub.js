import { ePub } from './epub.js-master/lib/epub.js'

function exportarLibro(){
    var book = ePub("./El_arte_de_la_guerra-Sun_Tzu.epub");
  var rendition = book.renderTo("area", {width: 600, height: 400});
  var displayed = rendition.display();
  book.renderTo("area", { method: "paginated", width: "100%", height: "100%" });
}

exportarLibro()