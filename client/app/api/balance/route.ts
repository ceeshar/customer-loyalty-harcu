import { NextResponse } from 'next/server';
import { SorobanRpc, Contract } from 'soroban-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const contract = searchParams.get('contract');

    if (!address || !contract) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
    const contractInstance = new Contract(contract);
    
    const result = await server.callContract({
      contractId: contract,
      method: 'get_balance',
      args: [address]
    });

    return NextResponse.json({ balance: result });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
} 