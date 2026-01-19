"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSupabaseService = void 0;
class BaseSupabaseService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    get client() {
        return this.supabaseService.getClient();
    }
    handleError(error, message) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : '';
        this.logger.error(`${message}: ${errorMessage}`, errorStack);
        throw error;
    }
}
exports.BaseSupabaseService = BaseSupabaseService;
//# sourceMappingURL=base-supabase.service.js.map