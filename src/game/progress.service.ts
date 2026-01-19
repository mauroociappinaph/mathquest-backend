import { Injectable, Logger } from '@nestjs/common';
import { BaseSupabaseService } from '../supabase/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EventsGateway } from '../events/events.gateway';

interface TableData {
  id: string;
}

@Injectable()
export class ProgressService extends BaseSupabaseService {
  protected readonly logger = new Logger(ProgressService.name);

  constructor(
    supabaseService: SupabaseService,
    private eventsGateway: EventsGateway,
  ) {
    super(supabaseService);
  }

  async updateProgress(
    childId: string,
    table: number,
    multiplicator: number,
    childName: string,
    parentId: string,
  ) {
    const { data, error: tableError } = await this.client
      .from('multiplication_tables')
      .select('id')
      .eq('number', table)
      .single();

    if (tableError) return;
    const tableData = data as TableData;

    if (tableData) {
      await this.client.rpc('increment_progress', {
        p_child_id: childId,
        p_table_id: tableData.id,
      });

      // Notificar al padre vía WebSockets
      this.eventsGateway.emitProgressUpdate(parentId, {
        childName,
        table,
        multiplicator,
        timestamp: new Date(),
      });
    }
  }

  async recordSession(childId: string, isCorrect: boolean) {
    await this.client.from('game_sessions').insert({
      child_id: childId,
      score: isCorrect ? 10 : 0,
      duration: 10,
      correct_answers: isCorrect ? 1 : 0,
      wrong_answers: isCorrect ? 0 : 1,
    });
  }
}
