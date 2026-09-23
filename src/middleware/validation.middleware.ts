import type { Request, Response, NextFunction } from 'express'
import { BadRequestException } from '../utils/responses/error.response'
import type {ZodType,ZodError} from 'zod'

type KeyReqType = keyof Request
type SchemaType = Partial<Record<KeyReqType, ZodType>>

type ValidationErrorsType = Array<{
    key: KeyReqType,
    issues: Array<{
        message: string,
        path:string|number|symbol|undefined
    }>
}>

export const validation = (schema: SchemaType) => {
    return (req: Request, res: Response, next: NextFunction): NextFunction => {
        const validationErrors: ValidationErrorsType = []
        
        for (const key of Object.keys(schema) as KeyReqType[]) {
            
            if (!schema[key]) continue
            
            const validationResult = schema[key].safeParse(req[key])
            if (!validationResult.success) {
                const errors = validationResult.error as ZodError
                
                validationErrors.push({
                    key,
                    issues: errors.issues.map((issue => {
                        return {message:issue.message,path:issue.path[0]}
                    }))
                })
            }
        }
        if (validationErrors.length > 0) {
          throw new BadRequestException("Validation Error", validationErrors);
        }
        return next() as unknown as NextFunction
    }
}
