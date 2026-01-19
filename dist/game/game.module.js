"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_controller_1 = require("./game.controller");
const game_service_1 = require("./game.service");
const ai_module_1 = require("../ai/ai.module");
const audio_module_1 = require("../audio/audio.module");
const events_module_1 = require("../events/events.module");
const profiles_module_1 = require("../profiles/profiles.module");
const supabase_module_1 = require("../supabase/supabase.module");
const progress_service_1 = require("./progress.service");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ai_module_1.AiModule,
            audio_module_1.AudioModule,
            events_module_1.EventsModule,
            profiles_module_1.ProfilesModule,
            supabase_module_1.SupabaseModule,
        ],
        controllers: [game_controller_1.GameController],
        providers: [game_service_1.GameService, progress_service_1.ProgressService],
        exports: [game_service_1.GameService, progress_service_1.ProgressService],
    })
], GameModule);
//# sourceMappingURL=game.module.js.map