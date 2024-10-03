// src/diagram/diagram.gateway.ts
import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CORS_OPTIONS } from './../../common/constants';

interface DiagramUpdate {
  nodes: any[];
  links: any[];
  selectedNode: any;
}

@WebSocketGateway(3001, {
  cors : { origin: '*' }
})
export class DiagramGateway {

  private logger = new Logger("socket");

  @WebSocketServer()
  server: Server;

  private diagramStates: Map<string, DiagramUpdate> = new Map(); // Diagram ID -> Diagram state
  private selectedNodes: Map<string, Map<string, string>> = new Map(); // Diagram ID -> (Node ID -> Socket ID)

  @SubscribeMessage('join-diagram')
  handleJoinDiagram(@ConnectedSocket() client: Socket, @MessageBody() idDiagrama: string): void {
    client.join(idDiagrama); // Join the client to the room for this diagram
    this.logger.log("usuario Conectado al diagrama: " + idDiagrama);
    if (!this.diagramStates.has(idDiagrama)) {
      this.diagramStates.set(idDiagrama, { nodes: [], links: [], selectedNode: null });
      this.selectedNodes.set(idDiagrama, new Map());
    }

    // Send the current diagram state to the client
    const diagramState = this.diagramStates.get(idDiagrama);
    client.emit('diagram-data', diagramState);
  }

  @SubscribeMessage('select-node')
  handleSelectNode(@ConnectedSocket() client: Socket, @MessageBody() { idDiagrama, nodeId }: { idDiagrama: string, nodeId: string }): void {
    const selectedNodes = this.selectedNodes.get(idDiagrama);    
    if (selectedNodes) {
      // Verificar si el usuario ya ha seleccionado un nodo en este diagrama
      for (let [selectedNodeId, socketId] of selectedNodes.entries()) {
        if (socketId === client.id) {
          // Deseleccionar el nodo anterior
          selectedNodes.delete(selectedNodeId);
          this.server.to(idDiagrama).emit('node-deselected', { nodeId: selectedNodeId });          
          break; // Se rompe el ciclo porque cada usuario solo puede tener un nodo seleccionado
        }
      }
      if(nodeId != ""){
        // Verificar si el nodo que se intenta seleccionar ya está seleccionado por otro usuario
        if (!selectedNodes.has(nodeId)) {
          // Seleccionar el nuevo nodo
          selectedNodes.set(nodeId, client.id);
          this.diagramStates.get(idDiagrama).selectedNode = nodeId; // Actualizar estado del diagrama
          this.server.to(idDiagrama).emit('node-selected', { nodeId, clientId: client.id });
        } else {
          // Si el nodo ya está seleccionado, emitir un mensaje de error
          client.emit('node-selection-failed', nodeId);
        }
      }      
    } else {
      // Si no hay nodos seleccionados para este diagrama, crear el map correspondiente
      const newSelectedNodes = new Map<string, string>();
      newSelectedNodes.set(nodeId, client.id);
      this.selectedNodes.set(idDiagrama, newSelectedNodes);
      
      this.diagramStates.get(idDiagrama).selectedNode = nodeId; // Actualizar estado del diagrama
      this.server.to(idDiagrama).emit('node-selected', { nodeId, clientId: client.id });
    }
  }

  // @SubscribeMessage('deselect-node')
  // handleDeselectNode(@ConnectedSocket() client: Socket, @MessageBody() { idDiagrama, nodeId }: { idDiagrama: string, nodeId: string }): void {
  //   const selectedNodes = this.selectedNodes.get(idDiagrama);
  //   if (selectedNodes && selectedNodes.get(nodeId) === client.id) {
  //     selectedNodes.delete(nodeId);
  //     this.diagramStates.get(idDiagrama).selectedNode = null;
  //     this.server.to(idDiagrama).emit('node-deselected', { nodeId });
  //   }
  // }

  @SubscribeMessage('update-diagram')
  handleDiagramUpdate(@ConnectedSocket() client: Socket, @MessageBody() { idDiagrama, nodes, links }: { idDiagrama: string, nodes: any[], links: any[] }): void {
    const diagramState = this.diagramStates.get(idDiagrama);
    diagramState.nodes = nodes;
    diagramState.links = links;
    this.server.to(idDiagrama).emit('diagram-updated', { nodes, links });
  }

  handleDisconnect(client: Socket) {
    // Deselect nodes when a client disconnects
    this.selectedNodes.forEach((selectedNodesMap, idDiagrama) => {
      for (let [nodeId, socketId] of selectedNodesMap.entries()) {
        if (socketId === client.id) {
          selectedNodesMap.delete(nodeId);
          this.server.to(idDiagrama).emit('node-deselected', { nodeId });
        }
      }
    });
  }
}
