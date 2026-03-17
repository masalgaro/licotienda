class ErrorDeDominio(Exception):
    pass


class ValidacionError(ErrorDeDominio):
    pass


class RecursoNoEncontradoError(ErrorDeDominio):
    pass


class OperacionNoPermitidaError(ErrorDeDominio):
    pass


class ConflictoNegocioError(ErrorDeDominio):
    pass


class ConfiguracionInvalidaError(ErrorDeDominio):
    pass
