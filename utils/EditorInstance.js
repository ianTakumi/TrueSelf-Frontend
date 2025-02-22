// editor.js
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Link from "@editorjs/link";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Paragraph from "@editorjs/paragraph";

let editorInstance;

export const initializeEditor = (holder) => {
  if (!editorInstance) {
    editorInstance = new EditorJS({
      holder,
      tools: {
        header: Header,
        list: List,
        embed: Embed,
        table: Table,
        link: Link,
        quote: Quote,
        marker: Marker,
        delimiter: Delimiter,
        paragraph: Paragraph,
      },
    });

    editorInstance.isReady
      .then(() => {
        console.log("Editor.js is ready!");
      })
      .catch((error) => {
        console.error("Error initializing Editor.js", error);
      });
  }
};

export const destroyEditor = async () => {
  if (editorInstance) {
    try {
      await editorInstance.destroy();
      editorInstance = null;
      console.log("Editor.js instance destroyed!");
    } catch (error) {
      console.error("Error destroying Editor.js instance", error);
    }
  }
};
