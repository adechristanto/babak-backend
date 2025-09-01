"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsModule = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const listings_controller_1 = require("./listings.controller");
const listing_images_service_1 = require("./images/listing-images.service");
const listing_images_controller_1 = require("./images/listing-images.controller");
const listing_upgrades_service_1 = require("./listing-upgrades.service");
const listing_upgrades_controller_1 = require("./listing-upgrades.controller");
const listing_attributes_service_1 = require("./listing-attributes.service");
const uploads_module_1 = require("../uploads/uploads.module");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const email_module_1 = require("../email/email.module");
let ListingsModule = class ListingsModule {
};
exports.ListingsModule = ListingsModule;
exports.ListingsModule = ListingsModule = __decorate([
    (0, common_1.Module)({
        imports: [uploads_module_1.UploadsModule, auth_module_1.AuthModule, users_module_1.UsersModule, email_module_1.EmailModule],
        controllers: [listings_controller_1.ListingsController, listing_images_controller_1.ListingImagesController, listing_upgrades_controller_1.ListingUpgradesController],
        providers: [listings_service_1.ListingsService, listing_images_service_1.ListingImagesService, listing_upgrades_service_1.ListingUpgradesService, listing_attributes_service_1.ListingAttributesService],
        exports: [listings_service_1.ListingsService, listing_images_service_1.ListingImagesService, listing_upgrades_service_1.ListingUpgradesService, listing_attributes_service_1.ListingAttributesService],
    })
], ListingsModule);
//# sourceMappingURL=listings.module.js.map