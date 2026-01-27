import { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="text-3xl font-bold mb-4">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-2xl font-semibold mb-3">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-xl font-medium mb-2">{children}</h3>;
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc ml-6 mb-4">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal ml-6 mb-4">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'block-quote':
      return (
        <blockquote {...attributes} className="border-l-4 border-primary pl-4 italic mb-4 text-muted-foreground">
          {children}
        </blockquote>
      );
    case 'code-block':
      return (
        <pre {...attributes} className="bg-muted rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
          <code>{children}</code>
        </pre>
      );
    case 'link':
      return (
        <a {...attributes} href={element.url} className="text-primary underline">
          {children}
        </a>
      );
    default:
      return <p {...attributes} className="mb-4">{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

const ToolbarButton = ({ active, onMouseDown, children, title }) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      'h-8 w-8 p-0',
      active && 'bg-muted'
    )}
    onMouseDown={onMouseDown}
    title={title}
    type="button"
  >
    {children}
  </Button>
);

const isMarkActive = (editor, format) => {
  const marks = editor.getMarks?.();
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    editor.nodes({
      at: editor.unhangRange(selection),
      match: n => !editor.isEditor(n) && editor.isBlock(n) && n.type === format,
    })
  );

  return !!match;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    editor.removeMark(format);
  } else {
    editor.addMark(format, true);
  }
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'bulleted-list' || format === 'numbered-list';

  editor.unwrapNodes({
    match: n => !editor.isEditor(n) && editor.isBlock(n) && ['bulleted-list', 'numbered-list'].includes(n.type),
    split: true,
  });

  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  
  editor.setNodes(newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    editor.wrapNodes(block);
  }
};

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState(value || initialValue);

  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const handleChange = (newValue) => {
    setEditorValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        <ToolbarButton
          active={isMarkActive(editor, 'bold')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'bold');
          }}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'italic')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'italic');
          }}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'underline')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'underline');
          }}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(editor, 'code')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'code');
          }}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          active={isBlockActive(editor, 'heading-one')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'heading-one');
          }}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'heading-two')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'heading-two');
          }}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'heading-three')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'heading-three');
          }}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          active={isBlockActive(editor, 'bulleted-list')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'bulleted-list');
          }}
          title="Bulleted List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'numbered-list')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'numbered-list');
          }}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <ToolbarButton
          active={isBlockActive(editor, 'block-quote')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'block-quote');
          }}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive(editor, 'code-block')}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'code-block');
          }}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>
      
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          className="min-h-[300px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none"
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
}

export function serializeToHtml(nodes) {
  return nodes.map(node => serializeNode(node)).join('');
}

function serializeNode(node) {
  if ('text' in node) {
    let text = node.text;
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.code) text = `<code>${text}</code>`;
    return text;
  }

  const children = node.children.map(n => serializeNode(n)).join('');

  switch (node.type) {
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;
    case 'code-block':
      return `<pre><code>${children}</code></pre>`;
    case 'link':
      return `<a href="${node.url}">${children}</a>`;
    default:
      return `<p>${children}</p>`;
  }
}
