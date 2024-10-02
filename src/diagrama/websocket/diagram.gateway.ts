// src/diagram/diagram.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NodoDiagrama } from '../interfaces/NodoDiagrama.interface';

interface DiagramUpdate {
  nodes: NodoDiagrama[];
  links: any[];
  selectedNode: any;
}

@WebSocketGateway()
export class DiagramGateway {
  @WebSocketServer()
  server: Server;

  private diagramState: DiagramUpdate = {
    nodes: [],
    links: [],
    selectedNode: null,
  };

  private selectedNodes: Map<string, string> = new Map(); // map of nodeId -> socketId

  @SubscribeMessage('load-diagram')
  handleLoadDiagram(client: Socket): void {
    // Send the current diagram state to the client
    client.emit('diagram-data', this.diagramState);
  }

  @SubscribeMessage('select-node')
  handleSelectNode(client: Socket, nodeId: string): void {
    if (!this.selectedNodes.has(nodeId)) {
      this.selectedNodes.set(nodeId, client.id);
      this.diagramState.selectedNode = nodeId;
      this.server.emit('node-selected', { nodeId, clientId: client.id });
    } else {
      client.emit('node-selection-failed', nodeId); // If the node is already selected
    }
  }

  @SubscribeMessage('deselect-node')
  handleDeselectNode(client: Socket, nodeId: string): void {
    if (this.selectedNodes.get(nodeId) === client.id) {
      this.selectedNodes.delete(nodeId);
      this.diagramState.selectedNode = null;
      this.server.emit('node-deselected', { nodeId });
    }
  }

  @SubscribeMessage('update-diagram')
  handleDiagramUpdate(client: Socket, updatedDiagram: DiagramUpdate): void {
    this.diagramState.nodes = updatedDiagram.nodes;
    this.diagramState.links = updatedDiagram.links;
    this.server.emit('diagram-updated', updatedDiagram);
  }

  handleDisconnect(client: Socket) {
    // If the client disconnects, deselect the node they selected
    for (let [nodeId, socketId] of this.selectedNodes.entries()) {
      if (socketId === client.id) {
        this.selectedNodes.delete(nodeId);
        this.server.emit('node-deselected', { nodeId });
      }
    }
  }
}
