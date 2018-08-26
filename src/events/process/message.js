module.exports = async (client, message) => {
  if (message === 'shutdown') {
    await client.log('notice', `Shuting down!${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`, 'Client')
    // Code to run before shutdown
    // ...
    process.exit(0)
  }
}
