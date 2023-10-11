const AgentsTable = (props: {agentList: any[]}) => {

  return (
    <div className="flex flex-col justify-items-center items-center h-screen">
        <div>
          <table className="mt-4 table-auto">
            <thead className="text-gray-100">
              <tr>
                <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                  Risk %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-500 divide-y divide-gray-200">
              {
                props.agentList?.map((agent, index) => 
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.username}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.role}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.risk_percentage}</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default AgentsTable