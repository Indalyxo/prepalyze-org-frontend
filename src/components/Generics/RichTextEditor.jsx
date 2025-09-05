import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import { RichTextEditor } from "@mantine/tiptap";
import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Text,
  Group,
  Button,
  Modal,
  TextInput,
  Stack,
  Loader,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

const AdvancedEditor = forwardRef(
  (
    {
      value = "",
      onChange,
      onBlur,
      placeholder = "Start writing your content here...",
      minHeight = 300,
      error,
      ...props
    },
    ref
  ) => {
    const [linkModalOpened, setLinkModalOpened] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          // Configure built-in extensions
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            style: "color: #228be6; text-decoration: underline;",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            style:
              "max-width: 100%; height: auto; border-radius: 6px; display: block; margin: 0.5rem 0;",
          },
        }),
        CodeBlock.configure({
          HTMLAttributes: {
            style:
              "background: #f4f4f4; padding: 8px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 0.5rem 0;",
          },
        }),
        Highlight.configure({ multicolor: true }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
        }),
        Placeholder.configure({
          placeholder,
        }),
        CharacterCount, // Add character count extension
      ],
      content: value || "<p></p>",
      editorProps: {
        attributes: {
          style: `min-height: ${minHeight}px; padding: 1rem; outline: none; font-size: 16px; line-height: 1.6; color: #212529;`,
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html === "<p></p>" ? "" : html);
      },
      onBlur: () => {
        onBlur?.();
      },
    });

    // Expose editor instance through ref
    useImperativeHandle(ref, () => ({
      editor,
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
      getHTML: () => editor?.getHTML(),
      setContent: (content) => editor?.commands.setContent(content),
    }));

    // Update editor content when value prop changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "<p></p>");
      }
    }, [editor, value]);

    const handleAddLink = useCallback(() => {
      if (!editor) return;
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);
      setLinkText(selectedText || "");
      setLinkUrl("");
      setLinkModalOpened(true);
    }, [editor]);

    const handleSetLink = useCallback(() => {
      if (!editor || !linkUrl) return;

      const { from, to } = editor.state.selection;

      if (from !== to) {
        // Text is selected, set link on selection
        editor.chain().focus().setLink({ href: linkUrl }).run();
      } else {
        // No text selected, insert link with text
        const displayText = linkText || linkUrl;
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${displayText}</a>`)
          .run();
      }

      setLinkModalOpened(false);
      setLinkUrl("");
      setLinkText("");
    }, [editor, linkUrl, linkText]);

    const handleImageUpload = useCallback(() => {
      if (!editor) return;
      const url = window.prompt("Enter image URL:");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }, [editor]);

    const handleKeyDown = useCallback(
      (event) => {
        // Handle Enter key in link modal
        if (event.key === "Enter" && linkModalOpened) {
          event.preventDefault();
          handleSetLink();
        }
      },
      [linkModalOpened, handleSetLink]
    );

    if (!editor) return <Loader size={"lg"} />;

    return (
      <Box>
        {props.label && <Text fw={500}>{props.label}</Text>}
        <RichTextEditor editor={editor} withCodeHighlighting={false} {...props}>
          {/* Toolbar */}
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Highlight />
              <RichTextEditor.ColorPicker
                colors={[
                  "#25262b",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
              />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Blockquote />
              <RichTextEditor.CodeBlock />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddLink}
                disabled={!editor}
              >
                Link
              </Button>
              <RichTextEditor.Unlink />
              <Button
                variant="default"
                size="sm"
                onClick={handleImageUpload}
                leftSection={<IconPhoto size={16} />}
              >
                Image
              </Button>
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            {!props.basic && (
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            )}
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            style={{
              borderColor: error ? "#fa5252" : undefined,
            }}
          />
        </RichTextEditor>

        {/* Link Modal */}
        <Modal
          opened={linkModalOpened}
          onClose={() => setLinkModalOpened(false)}
          title="Add Link"
          size="md"
          onKeyDown={handleKeyDown}
        >
          <Stack>
            <TextInput
              label="Link Text"
              placeholder="Enter link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <TextInput
              label="URL"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
              data-autofocus
            />
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setLinkModalOpened(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSetLink} disabled={!linkUrl}>
                Add Link
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Stats and Error */}
        <Box
          mt="sm"
          p="xs"
          style={{
            backgroundColor: error ? "#fff5f5" : "#f8f9fa",
            borderRadius: "4px",
            borderColor: error ? "#fa5252" : "transparent",
            borderWidth: error ? "1px" : "0",
            borderStyle: "solid",
          }}
        >
          <Group justify="space-between">
            <Group>
              <Text size="xs" c="dimmed">
                Words: {editor.storage.characterCount?.words() || 0}
              </Text>
              <Text size="xs" c="dimmed">
                Characters: {editor.storage.characterCount?.characters() || 0}
              </Text>
            </Group>
            {error && (
              <Text size="xs" c="red">
                {error}
              </Text>
            )}
          </Group>
        </Box>
      </Box>
    );
  }
);

AdvancedEditor.displayName = "AdvancedEditor";

export default AdvancedEditor;
