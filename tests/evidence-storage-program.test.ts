import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EvidenceStorage } from "../target/types/evidence_storage";

describe("Test Evidence Storage Initialize", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.EvidenceStorage as Program<EvidenceStorage>;

  const provider = anchor.AnchorProvider.env();
  const authority = provider.wallet.publicKey;

  let [baseAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-evidences")],
      program.programId
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      baseAccount,
      authority,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
