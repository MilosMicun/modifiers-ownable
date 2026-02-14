# Modifiers (Ownable Access Control)

This repo implements a minimal `Ownable` pattern using Solidity modifiers to enforce privileged access at the protocol level.

## What’s implemented

- `owner` stored as persistent state (EVM storage **slot 0**)
- `onlyOwner` modifier enforcing authorization invariant
- `transferOwnership(newOwner)` protected by `onlyOwner`
- Safety invariants:
  - `newOwner != address(0)` (prevents bricking admin functions)
  - `newOwner != owner` (prevents redundant transitions)
- `OwnershipTransferred(previousOwner, newOwner)` event for observability

## Storage layout

- **slot 0**: `owner` (`address`, 20 bytes)

Reads and writes:
- Read: `SLOAD(slot 0)`
- Write: `SSTORE(slot 0)`

## State transitions

### Deployment
- `owner = msg.sender`
- Writes deployer (or deploying contract) into slot 0.

### transferOwnership
- Checks invariants
- Emits event
- Updates slot 0 to `newOwner`

## Invariants (security properties)

- **Authorization**: For any `onlyOwner` function:
  - if `msg.sender != owner` → revert `"NOT_OWNER"`
- **No zero owner**:
  - transferring to `address(0)` must revert `"ZERO_ADDRESS"`
- **No redundant transfer**:
  - transferring to the current owner must revert `"SAME_OWNER"`

## Attack surface covered

- Prevents missing-access-control bugs on privileged functions
- Prevents admin bricking via `owner = address(0)`
- Provides auditability via events

## Tests

Hardhat tests prove:
- deployer is initialized as owner
- non-owner calls revert
- owner can transfer ownership
- `OwnershipTransferred` event is emitted with correct args
- invariant checks revert on zero address and same owner

## Run

```bash
npm install
npx hardhat test