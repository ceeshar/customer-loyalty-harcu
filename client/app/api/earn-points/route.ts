import { NextResponse } from 'next/server';
import { SorobanRpc, Contract } from 'soroban-client';

export async function POST(request: Request) {
  try {
    const { address, contract } = await request.json();

    if (!address || !contract) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
    const contractInstance = new Contract(contract);
    
    const result = await server.callContract({
      contractId: contract,
      method: 'earn_points',
      args: [address, 50] // 50 points per transaction
    });

    return NextResponse.json({ success: true, points: 50 });
  } catch (error) {
    console.error('Earn points error:', error);
    return NextResponse.json({ error: 'Failed to earn points' }, { status: 500 });
  }
} 