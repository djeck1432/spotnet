from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post('/api/deposit/{deposit_id}')
async def update_deposit(deposit_id: str, deposit_update: dict):
    # ... Your existing code ...
    result = await DepositCRUD.update_deposit(deposit_id, **deposit_update)
    if result is None:
        raise HTTPException(status_code=400, detail="Invalid deposit update")
    return result