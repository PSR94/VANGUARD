class VanguardError(Exception):
    def __init__(self, message: str, code: str = "vanguard_error", status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(VanguardError):
    def __init__(self, entity: str, entity_id: str):
        super().__init__(
            message=f"{entity} '{entity_id}' not found",
            code=f"{entity}_not_found",
            status_code=404,
        )


class InvalidStateError(VanguardError):
    def __init__(self, message: str, code: str = "invalid_state"):
        super().__init__(message=message, code=code, status_code=409)
