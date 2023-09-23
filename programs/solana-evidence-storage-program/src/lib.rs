use anchor_lang::prelude::*;

declare_id!("8uXuTvhpfLXpdyJ1E8tkFAhHYREMhbSGrFrciX9PgoiA");

#[program]
pub mod evidence_storage {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("first initialize");

        let base_account = &mut ctx.accounts.base_account;
        base_account.count = 0;

        Ok(())
    }

    pub fn add_evidence(ctx: Context<AddEvidence>, evidence_hash: String) -> Result<()> {
        let data = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.authority;

        // if evidence hash not exist
        let is_exist = data.evidences.iter().any(|e| e.hash == evidence_hash);

        if !is_exist {
            let evidence = Evidence {
                hash: evidence_hash,
                user_address: *user.to_account_info().key,
            };
            data.evidences.push(evidence);
            data.count += 1;
        }

        msg!("current evidences count: {}", data.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
    init,
    payer = authority,
    space = 9000,
    seeds = [b"user-evidences"],
    bump
    )]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddEvidence<'info> {
    #[account(
    mut,
    seeds = [b"user-evidences"],
    bump
    )]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[account]
pub struct BaseAccount {
    pub count: u64,
    pub evidences: Vec<Evidence>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Evidence {
    pub hash: String,
    pub user_address: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Cannot get the bump.")]
    CannotGetBump,
}