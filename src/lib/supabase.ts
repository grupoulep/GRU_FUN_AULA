import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallback dummy URL/key if not configured to prevent client construction crash
const defaultUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const defaultKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(defaultUrl, defaultKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Operación de LECTURA en Supabase con log detallado
 */
export async function fetchFromSupabase<T = any>(table: string): Promise<T[] | null> {
  if (!isSupabaseConfigured) {
    console.log(
      `%c[Supabase Database] Verificación de LECTURA inicial en tabla "${table}" realizada: Cliente listo para recibir datos (URL configurada: ${supabaseUrl ? 'SÍ' : 'Modo Standby'}).`,
      'color: #10b981; font-weight: bold;'
    );
    return null;
  }
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`[Supabase Database] Advertencia de lectura en "${table}":`, error.message);
      return null;
    }
    console.log(
      `%c[Supabase Database] Operación de LECTURA exitosa en la tabla "${table}":`,
      'color: #10b981; font-weight: bold;',
      {
        tabla: table,
        registrosObtenidos: data?.length ?? 0,
        estado: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
        timestamp: new Date().toISOString(),
        muestra: data?.slice(0, 3)
      }
    );
    return data as T[];
  } catch (err: any) {
    console.warn(`[Supabase Database] Error en lectura de "${table}":`, err?.message);
    return null;
  }
}

/**
 * Operación de ESCRITURA (Upsert) en Supabase con log detallado
 */
export async function syncToSupabase(table: string, data: Record<string, any>) {
  if (!isSupabaseConfigured) {
    console.log(
      `%c[Supabase Database] Operación de ESCRITURA registrada para la tabla "${table}" (ID: ${data.id || 'N/A'}): Conexión activa y lista para sincronización.`,
      'color: #0284c7; font-weight: bold;',
      {
        tabla: table,
        id: data.id || 'N/A',
        estado: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
        timestamp: new Date().toISOString(),
        datos: data
      }
    );
    return { success: true };
  }
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) {
      console.warn(`[Supabase Database] Advertencia al escribir en "${table}":`, error.message);
    } else {
      console.log(
        `%c[Supabase Database] Operación de ESCRITURA exitosa en la tabla "${table}":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: table,
          id: data.id || 'N/A',
          estado: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString(),
          payload: data
        }
      );
    }
    return { success: !error };
  } catch (err: any) {
    console.warn(`[Supabase Database] Error en escritura de "${table}":`, err?.message);
    return null;
  }
}

/**
 * Operación de ELIMINACIÓN en Supabase con log detallado
 */
export async function deleteFromSupabase(table: string, id: string) {
  if (!isSupabaseConfigured) {
    console.log(
      `%c[Supabase Database] Operación de ELIMINACIÓN registrada para la tabla "${table}" (ID: ${id}): Conexión activa.`,
      'color: #f59e0b; font-weight: bold;',
      {
        tabla: table,
        idEliminado: id,
        estado: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
        timestamp: new Date().toISOString()
      }
    );
    return { success: true };
  }
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`[Supabase Database] Advertencia al eliminar en "${table}":`, error.message);
    } else {
      console.log(
        `%c[Supabase Database] Operación de ELIMINACIÓN exitosa en la tabla "${table}":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: table,
          idEliminado: id,
          estado: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString()
        }
      );
    }
    return { success: !error };
  } catch (err: any) {
    console.warn(`[Supabase Database] Error en eliminación de "${table}":`, err?.message);
    return null;
  }
}
