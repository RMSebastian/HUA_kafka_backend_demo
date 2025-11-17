import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function validatePayload<T extends object>(
  dto: new () => T,
  data: any,
): Promise<T> {
  const instance = plainToInstance(dto, data, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });
  console.log('Validating payload:', instance);
  const errors: ValidationError[] = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });

  // Manejo de errores con salida clara
  if (errors.length > 0) {
    const formatted = errors.map((e) => e.constraints ?? {}).filter(Boolean);
    throw new Error(
      'Payload validation failed: ' + JSON.stringify(formatted, null, 2),
    );
  }

  return instance;
}
