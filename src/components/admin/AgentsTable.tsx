import { Oval } from "react-loader-spinner";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from "react";

const DraggableTableRows = (props: {baseUrl: string, agentList: any[], setRefreshKey: any}) => {
  const elements: JSX.Element[] = [];
  let agentList = props.agentList;
  console.log("ROWS",agentList);

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: "none",
  
    background: isDragging && "#e9d5ff",

    display: isDragging && "table",

    ...draggableStyle
  });

  elements.push(
    <Droppable key={"agentDroppable"} droppableId={"agentDroppable"}>
      {(provided) => (
        <tbody ref={provided.innerRef} {...provided.droppableProps} className="text-slate-700">
          {agentList.map((agent, index) => {
            return <Draggable key={agent.id + "draggable"} draggableId={agent.id.toString()} index={index}>
              {(provided, snapshot) => (
                <tr
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  key={agent.id}
                  className="even:bg-white odd:bg-slate-100"
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{index+1}</td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">
                    <div className="flex flex-row items-center">
                      <EditUser baseUrl={props.baseUrl} user={agent} setRefreshKey={props.setRefreshKey} />
                      {agent.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{agent.username}</td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{agent.role}</td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{agent.risk_percentage}%</td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{agent.gabe_way}%</td>
                  <td className="px-3 py-2 whitespace-no-wrap text-slate-500">{100 - (agent.risk_percentage + (agent.gabe_way || 0))}%</td>
                </tr>
              )}
            </Draggable>
          })}
          {provided.placeholder}
          <tr key={"addUser"}>
            <td colSpan={7} className="bg-slate-400 hover:bg-slate-500 text-slate-100 rounded-b">
              <AddUser setRefreshKey={props.setRefreshKey} />
            </td>
          </tr>
        </tbody>
      )}
    </Droppable>
  )
  return elements
}

const AgentsTable = (props: {baseUrl: string, agentList: any[], isLoading: boolean, setRefreshKey: any}) => {
  const [agents, setAgents] = useState<any[]>(props.agentList);

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const handleDrop = (result: any) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      agents,
      result.source.index,
      result.destination.index
    );
    const agentIdsOrder = items.map((agent) => agent.id);
    fetch(props.baseUrl + "/api/user/edit", {
      method: "POST",
      body: JSON.stringify({
        userId: "48yagmg327z5jo3",
        userData: {
          agentOrder: agentIdsOrder,
        },
      })
    })
    setAgents(items);
  };

  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDrop}>
        <table className="table-auto min-w-full">
          <thead className="text-slate-100">
            <tr>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider rounded-tl">
                #
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider">
                Risk
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider">
                G Way
              </th>
              <th className="px-3 py-3 bg-slate-700 text-left text-sm font-bold uppercase tracking-wider rounded-tr">
                T Way
              </th>
            </tr>
          </thead>
          {props.isLoading ? (
            <tbody>
              <tr>
                  <td colSpan={12} className="mx-auto py-3 text-center bg-[17, 23, 41]">
                    <Oval
                      height={60}
                      width={60}
                      color="#4287f5"
                      wrapperStyle={{display: "flex", "justifyContent": "center"}}
                      visible={true}
                      ariaLabel='oval-loading'
                      secondaryColor="#4d64ab"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </td>
                </tr>
            </tbody>
          ) : (
            <DraggableTableRows baseUrl={props.baseUrl} agentList={agents} setRefreshKey={props.setRefreshKey} />
          )}
        </table>
      </DragDropContext>
  </div>
  )
}

export default AgentsTable