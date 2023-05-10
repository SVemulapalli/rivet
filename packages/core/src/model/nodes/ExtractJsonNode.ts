import { ChartNode, NodeId, NodeInputDefinition, PortId, NodeOutputDefinition } from '../NodeBase';
import { nanoid } from 'nanoid';
import { NodeImpl } from '../NodeImpl';
import { DataValue, expectType } from '../DataValue';

export type ExtractJsonNode = ChartNode<'extractJson', ExtractJsonNodeData>;

export type ExtractJsonNodeData = {};

export class ExtractJsonNodeImpl extends NodeImpl<ExtractJsonNode> {
  static create(): ExtractJsonNode {
    const chartNode: ExtractJsonNode = {
      type: 'extractJson',
      title: 'Extract JSON',
      id: nanoid() as NodeId,
      visualData: {
        x: 0,
        y: 0,
        width: 250,
      },
      data: {},
    };

    return chartNode;
  }

  getInputDefinitions(): NodeInputDefinition[] {
    return [
      {
        id: 'input' as PortId,
        title: 'Input',
        dataType: 'string',
        required: true,
      },
    ];
  }

  getOutputDefinitions(): NodeOutputDefinition[] {
    return [
      {
        id: 'output' as PortId,
        title: 'Output',
        dataType: 'object',
      },
      {
        id: 'noMatch' as PortId,
        title: 'No Match',
        dataType: 'string',
      },
    ];
  }

  async process(inputs: Record<PortId, DataValue>): Promise<Record<PortId, DataValue>> {
    const inputString = expectType(inputs['input' as PortId], 'string');

    const firstBracket = inputString.indexOf('{');
    const lastBracket = inputString.lastIndexOf('}');
    const firstSquareBracket = inputString.indexOf('[');
    const lastSquareBracket = inputString.lastIndexOf(']');

    const firstIndex = Math.min(firstBracket, firstSquareBracket);
    const lastIndex = Math.max(lastBracket, lastSquareBracket);

    const substring = inputString.substring(firstIndex, lastIndex + 1);

    let jsonObject: Record<string, unknown> | undefined = undefined;
    try {
      jsonObject = JSON.parse(substring);
    } catch (err) {
      return {
        ['noMatch' as PortId]: {
          type: 'string',
          value: inputString,
        },
        ['output' as PortId]: {
          type: 'control-flow-excluded',
          value: undefined,
        },
      };
    }

    return {
      ['output' as PortId]: {
        type: 'object',
        value: jsonObject!,
      },
      ['noMatch' as PortId]: {
        type: 'control-flow-excluded',
        value: undefined,
      },
    };
  }
}
