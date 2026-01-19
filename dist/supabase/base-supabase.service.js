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
        this.logger.error(`${message}: ${error.message || error}`, error.stack);
        throw error;
    }
}
exports.BaseSupabaseService = BaseSupabaseService;
//# sourceMappingURL=base-supabase.service.js.map