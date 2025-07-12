import { z, ZodObject, ZodDefault, ZodEffects, ZodIntersection } from "zod";

export function extractDefaultsFromSchema<T extends z.ZodRawShape>(
    schema: ZodObject<T> | ZodEffects<ZodObject<T>> | ZodIntersection<ZodObject<T>, any>
): z.infer<ZodObject<T>> {
    let unwrappedSchema: any = schema;
    if (schema instanceof ZodEffects) {
        unwrappedSchema = schema._def.schema;
    }

    if (unwrappedSchema instanceof ZodIntersection) {
        const leftDefaults = extractDefaultsFromSchema(unwrappedSchema._def.left);
        const rightDefaults = extractDefaultsFromSchema(unwrappedSchema._def.right);
        return { ...leftDefaults, ...rightDefaults } as z.infer<ZodIntersection<ZodObject<T>, any>>;
    }

    const defaults: any = {};
    for (const key in unwrappedSchema.shape) {
        const field = unwrappedSchema.shape[key];
        if (field instanceof ZodDefault) {
            defaults[key] = field._def.defaultValue();
        }
        else if (field instanceof ZodObject || field instanceof ZodEffects) {
            defaults[key] = extractDefaultsFromSchema(field);
        } else {
            defaults[key] = undefined;
        }
    }
    return defaults;
}

