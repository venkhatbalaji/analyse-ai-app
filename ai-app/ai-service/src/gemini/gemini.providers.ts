import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from './gemini.config';
import { GEMINI_PRO_MODEL, GEMINI_PRO_VISION_MODEL } from './gemini.constants';
import { ConfigService } from '@nestjs/config';

export const GeminiProModelProvider: Provider<GenerativeModel> = {
  provide: GEMINI_PRO_MODEL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const genAI = new GoogleGenerativeAI(configService.get('GEMINI_API_KEY'));
    return genAI.getGenerativeModel({
      model: configService.get('GEMINI_PRO_MODEL'),
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};

export const GeminiProVisionModelProvider: Provider<GenerativeModel> = {
  provide: GEMINI_PRO_VISION_MODEL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const genAI = new GoogleGenerativeAI(configService.get('GEMINI_API_KEY'));
    return genAI.getGenerativeModel({
      model: configService.get('GEMINI_PRO_VISION_MODEL'),
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};
