import { Field, HelperMessage } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { type StringEditorDefinition, type ChartNode } from '@ironclad/rivet-core';
import { type FC } from 'react';
import { type SharedEditorProps } from './SharedEditorProps';
import { getHelperMessage } from './editorUtils';

export const DefaultStringEditor: FC<
  SharedEditorProps & {
    editor: StringEditorDefinition<ChartNode>;
  }
> = ({ node, isReadonly, isDisabled, onChange, editor, onClose }) => {
  const data = node.data as Record<string, unknown>;
  const helperMessage = getHelperMessage(editor, node.data);
  return (
    <Field name={editor.dataKey} label={editor.label} isDisabled={isDisabled}>
      {({ fieldProps }) => (
        <>
          <TextField
            {...fieldProps}
            value={data[editor.dataKey] as string | undefined}
            isReadOnly={isReadonly}
            autoFocus={editor.autoFocus}
            onChange={(e) =>
              onChange({
                ...node,
                data: {
                  ...data,
                  [editor.dataKey]: (e.target as HTMLInputElement).value,
                },
              })
            }
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose?.();
              }
            }}
          />
          {helperMessage && <HelperMessage>{helperMessage}</HelperMessage>}
        </>
      )}
    </Field>
  );
};
