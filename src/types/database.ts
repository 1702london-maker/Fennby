export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          age_range: string | null
          capacity: number | null
          consent_required: boolean
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          price: string | null
          safety_notes: string | null
          start_date: string | null
          status: string
          title: string
          type: string | null
        }
        Insert: {
          age_range?: string | null
          capacity?: number | null
          consent_required?: boolean
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          price?: string | null
          safety_notes?: string | null
          start_date?: string | null
          status?: string
          title: string
          type?: string | null
        }
        Update: {
          age_range?: string | null
          capacity?: number | null
          consent_required?: boolean
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          price?: string | null
          safety_notes?: string | null
          start_date?: string | null
          status?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      activity_registrations: {
        Row: {
          activity_id: string
          booking_status: string
          consent_status: string
          id: string
          learner_id: string
        }
        Insert: {
          activity_id: string
          booking_status?: string
          consent_status?: string
          id?: string
          learner_id: string
        }
        Update: {
          activity_id?: string
          booking_status?: string
          consent_status?: string
          id?: string
          learner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_registrations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_registrations_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tutor_conversations: {
        Row: {
          ended_at: string | null
          id: string
          learner_id: string
          started_at: string
          subject_key: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          learner_id: string
          started_at?: string
          subject_key?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          learner_id?: string
          started_at?: string
          subject_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tutor_conversations_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tutor_conversations_subject_key_fkey"
            columns: ["subject_key"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["key"]
          },
        ]
      }
      ai_tutor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tutor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_tutor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_attempts: {
        Row: {
          accommodations_used: Json | null
          assessment_id: string | null
          completed_at: string | null
          id: string
          learner_id: string
          mode: string
          source_id: string | null
          source_type: string | null
          started_at: string
        }
        Insert: {
          accommodations_used?: Json | null
          assessment_id?: string | null
          completed_at?: string | null
          id?: string
          learner_id: string
          mode: string
          source_id?: string | null
          source_type?: string | null
          started_at?: string
        }
        Update: {
          accommodations_used?: Json | null
          assessment_id?: string | null
          completed_at?: string | null
          id?: string
          learner_id?: string
          mode?: string
          source_id?: string | null
          source_type?: string | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_attempts_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          id: string
          position: number
          question_id: string
        }
        Insert: {
          assessment_id: string
          id?: string
          position?: number
          question_id: string
        }
        Update: {
          assessment_id?: string
          id?: string
          position?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          learner_id: string
          percentile: number | null
          score: number
          standardised_score: number | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          learner_id: string
          percentile?: number | null
          score: number
          standardised_score?: number | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          learner_id?: string
          percentile?: number | null
          score?: number
          standardised_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          age_group: string | null
          difficulty_mix: string | null
          duration_minutes: number | null
          exam_board: string | null
          id: string
          level_key: string | null
          mode: string | null
          published: boolean
          subject_keys: string[]
          title: string
        }
        Insert: {
          age_group?: string | null
          difficulty_mix?: string | null
          duration_minutes?: number | null
          exam_board?: string | null
          id?: string
          level_key?: string | null
          mode?: string | null
          published?: boolean
          subject_keys?: string[]
          title: string
        }
        Update: {
          age_group?: string | null
          difficulty_mix?: string | null
          duration_minutes?: number | null
          exam_board?: string | null
          id?: string
          level_key?: string | null
          mode?: string | null
          published?: boolean
          subject_keys?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_level_key_fkey"
            columns: ["level_key"]
            isOneToOne: false
            referencedRelation: "education_levels"
            referencedColumns: ["key"]
          },
        ]
      }
      attempt_answers: {
        Row: {
          attempt_id: string
          choice_index: number | null
          id: string
          question_id: string
        }
        Insert: {
          attempt_id: string
          choice_index?: number | null
          id?: string
          question_id: string
        }
        Update: {
          attempt_id?: string
          choice_index?: number | null
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          entity: string | null
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_warmups: {
        Row: {
          activity_type: string | null
          completed_at: string | null
          id: string
          learner_id: string
          mood_after: Database["public"]["Enums"]["mood_type"] | null
          mood_before: Database["public"]["Enums"]["mood_type"] | null
          score: number | null
          started_at: string
        }
        Insert: {
          activity_type?: string | null
          completed_at?: string | null
          id?: string
          learner_id: string
          mood_after?: Database["public"]["Enums"]["mood_type"] | null
          mood_before?: Database["public"]["Enums"]["mood_type"] | null
          score?: number | null
          started_at?: string
        }
        Update: {
          activity_type?: string | null
          completed_at?: string | null
          id?: string
          learner_id?: string
          mood_after?: Database["public"]["Enums"]["mood_type"] | null
          mood_before?: Database["public"]["Enums"]["mood_type"] | null
          score?: number | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_warmups_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      class_memberships: {
        Row: {
          class_id: string
          id: string
          learner_id: string
        }
        Insert: {
          class_id: string
          id?: string
          learner_id: string
        }
        Update: {
          class_id?: string
          id?: string
          learner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_memberships_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_memberships_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          id: string
          name: string
          school_id: string
          year_group: string
        }
        Insert: {
          id?: string
          name: string
          school_id: string
          year_group: string
        }
        Update: {
          id?: string
          name?: string
          school_id?: string
          year_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          topic: string
        }
        Insert: {
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          topic?: string
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          topic?: string
        }
        Relationships: []
      }
      cradle_participants: {
        Row: {
          anonymized_display_name: string | null
          id: string
          joined_at: string
          profile_id: string
          role_in_session: string
          session_id: string
        }
        Insert: {
          anonymized_display_name?: string | null
          id?: string
          joined_at?: string
          profile_id: string
          role_in_session?: string
          session_id: string
        }
        Update: {
          anonymized_display_name?: string | null
          id?: string
          joined_at?: string
          profile_id?: string
          role_in_session?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cradle_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cradle_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cradle_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cradle_sessions: {
        Row: {
          ended_at: string | null
          host_id: string
          id: string
          lesson_session_id: string | null
          peer_anonymity_enabled: boolean
          recording_status: string
          recording_url: string | null
          session_type: string
          started_at: string
          video_provider: string
          video_room_sid: string | null
        }
        Insert: {
          ended_at?: string | null
          host_id: string
          id?: string
          lesson_session_id?: string | null
          peer_anonymity_enabled?: boolean
          recording_status?: string
          recording_url?: string | null
          session_type?: string
          started_at?: string
          video_provider?: string
          video_room_sid?: string | null
        }
        Update: {
          ended_at?: string | null
          host_id?: string
          id?: string
          lesson_session_id?: string | null
          peer_anonymity_enabled?: boolean
          recording_status?: string
          recording_url?: string | null
          session_type?: string
          started_at?: string
          video_provider?: string
          video_room_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cradle_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cradle_sessions_lesson_session_id_fkey"
            columns: ["lesson_session_id"]
            isOneToOne: false
            referencedRelation: "lesson_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      curricula: {
        Row: {
          content: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          subject_key: string
          title: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          subject_key: string
          title: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          subject_key?: string
          title?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curricula_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curricula_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education_levels: {
        Row: {
          key: string
          name: string
          sort_order: number
        }
        Insert: {
          key: string
          name: string
          sort_order?: number
        }
        Update: {
          key?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      guardian_permissions: {
        Row: {
          guardian_id: string
          id: string
          learner_id: string
          relationship: string
          view_only: boolean
        }
        Insert: {
          guardian_id: string
          id?: string
          learner_id: string
          relationship?: string
          view_only?: boolean
        }
        Update: {
          guardian_id?: string
          id?: string
          learner_id?: string
          relationship?: string
          view_only?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "guardian_permissions_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_permissions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      homework: {
        Row: {
          assigned_by: string | null
          due_date: string | null
          id: string
          learner_id: string
          status: string
          subject: string | null
          title: string
        }
        Insert: {
          assigned_by?: string | null
          due_date?: string | null
          id?: string
          learner_id: string
          status?: string
          subject?: string | null
          title: string
        }
        Update: {
          assigned_by?: string | null
          due_date?: string | null
          id?: string
          learner_id?: string
          status?: string
          subject?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_help_requests: {
        Row: {
          created_at: string
          id: string
          learner_id: string
          status: string
          storage_path: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          learner_id: string
          status?: string
          storage_path?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          learner_id?: string
          status?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_help_requests_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      inter_school_event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          registered_by: string | null
          school_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          registered_by?: string | null
          school_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          registered_by?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inter_school_event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "inter_school_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inter_school_event_registrations_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inter_school_event_registrations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      inter_school_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_type: string
          id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type: string
          id?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number | null
          id: string
          issued_at: string
          status: string | null
          subscription_id: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          issued_at?: string
          status?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          issued_at?: string
          status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_achievements: {
        Row: {
          achievement_id: string
          awarded_at: string
          id: string
          learner_id: string
        }
        Insert: {
          achievement_id: string
          awarded_at?: string
          id?: string
          learner_id: string
        }
        Update: {
          achievement_id?: string
          awarded_at?: string
          id?: string
          learner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learner_achievements_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      learners: {
        Row: {
          accessibility_needs: string | null
          auth_id: string | null
          avatar_emoji: string | null
          created_at: string
          current_school: string | null
          date_of_birth: string
          exam_board: string | null
          first_name: string
          id: string
          learning_goals: string | null
          learning_preferences: Json
          parent_id: string
          preferred_name: string
          send_notes: string | null
          target_exam: string | null
          target_school: string | null
          updated_at: string
          year_group: string
        }
        Insert: {
          accessibility_needs?: string | null
          auth_id?: string | null
          avatar_emoji?: string | null
          created_at?: string
          current_school?: string | null
          date_of_birth: string
          exam_board?: string | null
          first_name: string
          id?: string
          learning_goals?: string | null
          learning_preferences?: Json
          parent_id: string
          preferred_name: string
          send_notes?: string | null
          target_exam?: string | null
          target_school?: string | null
          updated_at?: string
          year_group: string
        }
        Update: {
          accessibility_needs?: string | null
          auth_id?: string | null
          avatar_emoji?: string | null
          created_at?: string
          current_school?: string | null
          date_of_birth?: string
          exam_board?: string | null
          first_name?: string
          id?: string
          learning_goals?: string | null
          learning_preferences?: Json
          parent_id?: string
          preferred_name?: string
          send_notes?: string | null
          target_exam?: string | null
          target_school?: string | null
          updated_at?: string
          year_group?: string
        }
        Relationships: [
          {
            foreignKeyName: "learners_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_notes: {
        Row: {
          confidence: string | null
          covered: string | null
          created_at: string
          homework_assigned: string | null
          id: string
          learner_id: string
          learning_objective: string | null
          parent_summary: string | null
          safeguarding_concern: boolean
          session_id: string
          strengths: string | null
          subject: string | null
          topic: string | null
          tutor_id: string
          weaknesses: string | null
        }
        Insert: {
          confidence?: string | null
          covered?: string | null
          created_at?: string
          homework_assigned?: string | null
          id?: string
          learner_id: string
          learning_objective?: string | null
          parent_summary?: string | null
          safeguarding_concern?: boolean
          session_id: string
          strengths?: string | null
          subject?: string | null
          topic?: string | null
          tutor_id: string
          weaknesses?: string | null
        }
        Update: {
          confidence?: string | null
          covered?: string | null
          created_at?: string
          homework_assigned?: string | null
          id?: string
          learner_id?: string
          learning_objective?: string | null
          parent_summary?: string | null
          safeguarding_concern?: boolean
          session_id?: string
          strengths?: string | null
          subject?: string | null
          topic?: string | null
          tutor_id?: string
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_notes_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "lesson_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_notes_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_sessions: {
        Row: {
          commission_rate: number
          hourly_rate: number | null
          id: string
          learner_id: string
          payment_status: string
          scheduled_at: string
          status: string
          subject: string | null
          tutor_id: string
        }
        Insert: {
          commission_rate?: number
          hourly_rate?: number | null
          id?: string
          learner_id: string
          payment_status?: string
          scheduled_at: string
          status?: string
          subject?: string | null
          tutor_id: string
        }
        Update: {
          commission_rate?: number
          hourly_rate?: number | null
          id?: string
          learner_id?: string
          payment_status?: string
          scheduled_at?: string
          status?: string
          subject?: string | null
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_sessions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_sessions_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          id: string
          message_id: string
          mime_type: string
          scanned_status: string
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          id?: string
          message_id: string
          mime_type: string
          scanned_status?: string
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          id?: string
          message_id?: string
          mime_type?: string
          scanned_status?: string
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_read_receipts: {
        Row: {
          message_id: string
          profile_id: string
          read_at: string
        }
        Insert: {
          message_id: string
          profile_id: string
          read_at?: string
        }
        Update: {
          message_id?: string
          profile_id?: string
          read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_receipts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_read_receipts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          cradle_session_id: string | null
          id: string
          learner_id: string | null
        }
        Insert: {
          cradle_session_id?: string | null
          id?: string
          learner_id?: string | null
        }
        Update: {
          cradle_session_id?: string | null
          id?: string
          learner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_cradle_session_id_fkey"
            columns: ["cradle_session_id"]
            isOneToOne: false
            referencedRelation: "cradle_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          flagged: boolean
          flagged_reason: string | null
          id: string
          read: boolean
          sender_id: string
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          flagged?: boolean
          flagged_reason?: string | null
          id?: string
          read?: boolean
          sender_id: string
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          flagged?: boolean
          flagged_reason?: string | null
          id?: string
          read?: boolean
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_exam_purchases: {
        Row: {
          amount: number
          created_at: string
          id: string
          learner_id: string
          paid_at: string | null
          parent_id: string
          sitting_id: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          learner_id: string
          paid_at?: string | null
          parent_id: string
          sitting_id: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          learner_id?: string
          paid_at?: string | null
          parent_id?: string
          sitting_id?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_exam_purchases_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_exam_purchases_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_exam_purchases_sitting_id_fkey"
            columns: ["sitting_id"]
            isOneToOne: false
            referencedRelation: "mock_exam_sittings"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_exam_sittings: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          price: number
          sitting_date: string
          status: string
          subject_key: string | null
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          price: number
          sitting_date: string
          status?: string
          subject_key?: string | null
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          price?: number
          sitting_date?: string
          status?: string
          subject_key?: string | null
          title?: string
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          created_at: string
          id: string
          learner_id: string
          mood: Database["public"]["Enums"]["mood_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          learner_id: string
          mood: Database["public"]["Enums"]["mood_type"]
        }
        Update: {
          created_at?: string
          id?: string
          learner_id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
        }
        Relationships: [
          {
            foreignKeyName: "mood_checkins_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          payload: Json
          profile_id: string
          read_at: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          profile_id: string
          read_at?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          profile_id?: string
          read_at?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["role_type"]
          status: string
          subscription_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["role_type"]
          status?: string
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["role_type"]
          status?: string
          subscription_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: number
          difficulty: string | null
          estimated_seconds: number | null
          exam_board: string | null
          explanation: string | null
          id: string
          options: string[]
          status: string
          subject_key: string | null
          text: string
          topic_key: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          correct_answer: number
          difficulty?: string | null
          estimated_seconds?: number | null
          exam_board?: string | null
          explanation?: string | null
          id?: string
          options?: string[]
          status?: string
          subject_key?: string | null
          text: string
          topic_key?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          correct_answer?: number
          difficulty?: string | null
          estimated_seconds?: number | null
          exam_board?: string | null
          explanation?: string | null
          id?: string
          options?: string[]
          status?: string
          subject_key?: string | null
          text?: string
          topic_key?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_subject_key_fkey"
            columns: ["subject_key"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "questions_topic_key_fkey"
            columns: ["topic_key"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["key"]
          },
        ]
      }
      referrals: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          referral_type: string
          referred_by: string
          status: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          description: string
          id?: string
          referral_type: string
          referred_by: string
          status?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          referral_type?: string
          referred_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_items: {
        Row: {
          due_date: string | null
          id: string
          learner_id: string
          priority: string | null
          reason: string | null
          recommended_activity: string | null
          status: string
          subject: string | null
          topic: string | null
        }
        Insert: {
          due_date?: string | null
          id?: string
          learner_id: string
          priority?: string | null
          reason?: string | null
          recommended_activity?: string | null
          status?: string
          subject?: string | null
          topic?: string | null
        }
        Update: {
          due_date?: string | null
          id?: string
          learner_id?: string
          priority?: string | null
          reason?: string | null
          recommended_activity?: string | null
          status?: string
          subject?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revision_items_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      safeguarding_cases: {
        Row: {
          actions_taken: string | null
          assigned_to: string | null
          concern_type: string | null
          created_at: string
          description: string | null
          id: string
          learner_id: string
          outcome: string | null
          priority: string | null
          reported_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          actions_taken?: string | null
          assigned_to?: string | null
          concern_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          learner_id: string
          outcome?: string | null
          priority?: string | null
          reported_by?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          actions_taken?: string | null
          assigned_to?: string | null
          concern_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          learner_id?: string
          outcome?: string | null
          priority?: string | null
          reported_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safeguarding_cases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safeguarding_cases_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      school_child_links: {
        Row: {
          id: string
          learner_id: string
          relationship: string
          school_id: string
        }
        Insert: {
          id?: string
          learner_id: string
          relationship: string
          school_id: string
        }
        Update: {
          id?: string
          learner_id?: string
          relationship?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_child_links_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_child_links_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_users: {
        Row: {
          id: string
          profile_id: string
          role_at_school: string
          school_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          role_at_school?: string
          school_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          role_at_school?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          approved: boolean
          billing_tier: string
          brand_accent_color: string | null
          brand_logo_url: string | null
          brand_name: string | null
          contact_name: string | null
          created_at: string
          data_protection_contact: string | null
          id: string
          local_authority: string | null
          name: string
          pupil_count: number | null
          safeguarding_lead_contact: string | null
          school_type: string | null
          urn: string | null
          year_groups: string[]
        }
        Insert: {
          address?: string | null
          approved?: boolean
          billing_tier?: string
          brand_accent_color?: string | null
          brand_logo_url?: string | null
          brand_name?: string | null
          contact_name?: string | null
          created_at?: string
          data_protection_contact?: string | null
          id?: string
          local_authority?: string | null
          name: string
          pupil_count?: number | null
          safeguarding_lead_contact?: string | null
          school_type?: string | null
          urn?: string | null
          year_groups?: string[]
        }
        Update: {
          address?: string | null
          approved?: boolean
          billing_tier?: string
          brand_accent_color?: string | null
          brand_logo_url?: string | null
          brand_name?: string | null
          contact_name?: string | null
          created_at?: string
          data_protection_contact?: string | null
          id?: string
          local_authority?: string | null
          name?: string
          pupil_count?: number | null
          safeguarding_lead_contact?: string | null
          school_type?: string | null
          urn?: string | null
          year_groups?: string[]
        }
        Relationships: []
      }
      subjects: {
        Row: {
          category: string
          key: string
          name: string
        }
        Insert: {
          category?: string
          key: string
          name: string
        }
        Update: {
          category?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          id: string
          parent_id: string
          plan_name: string | null
          status: string | null
        }
        Insert: {
          current_period_end?: string | null
          id?: string
          parent_id: string
          plan_name?: string | null
          status?: string | null
        }
        Update: {
          current_period_end?: string | null
          id?: string
          parent_id?: string
          plan_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          id: string
          profile_id: string
          role_in_thread: string
          thread_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          role_in_thread: string
          thread_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          role_in_thread?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_performance: {
        Row: {
          id: string
          result_id: string
          score: number
          topic_key: string | null
        }
        Insert: {
          id?: string
          result_id: string
          score: number
          topic_key?: string | null
        }
        Update: {
          id?: string
          result_id?: string
          score?: number
          topic_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_performance_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_performance_topic_key_fkey"
            columns: ["topic_key"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["key"]
          },
        ]
      }
      topics: {
        Row: {
          key: string
          name: string
          subject_key: string
        }
        Insert: {
          key: string
          name: string
          subject_key: string
        }
        Update: {
          key?: string
          name?: string
          subject_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_key_fkey"
            columns: ["subject_key"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["key"]
          },
        ]
      }
      tutor_applications: {
        Row: {
          age_groups: string[]
          agreement_signed_at: string | null
          created_at: string
          dbs_status: string | null
          exam_boards: string[]
          examiner_boards_claimed: string[]
          examiner_claim: string | null
          experience_years: number | null
          id: string
          onboarding_state: string
          profile_id: string
          qualifications: string | null
          references_provided: string | null
          reviewed_by: string | null
          safeguarding_declaration: boolean | null
          send_experience: string[]
          status: Database["public"]["Enums"]["tutor_status"]
          subjects: string[]
          temp_password_issued: boolean
        }
        Insert: {
          age_groups?: string[]
          agreement_signed_at?: string | null
          created_at?: string
          dbs_status?: string | null
          exam_boards?: string[]
          examiner_boards_claimed?: string[]
          examiner_claim?: string | null
          experience_years?: number | null
          id?: string
          onboarding_state?: string
          profile_id: string
          qualifications?: string | null
          references_provided?: string | null
          reviewed_by?: string | null
          safeguarding_declaration?: boolean | null
          send_experience?: string[]
          status?: Database["public"]["Enums"]["tutor_status"]
          subjects?: string[]
          temp_password_issued?: boolean
        }
        Update: {
          age_groups?: string[]
          agreement_signed_at?: string | null
          created_at?: string
          dbs_status?: string | null
          exam_boards?: string[]
          examiner_boards_claimed?: string[]
          examiner_claim?: string | null
          experience_years?: number | null
          id?: string
          onboarding_state?: string
          profile_id?: string
          qualifications?: string | null
          references_provided?: string | null
          reviewed_by?: string | null
          safeguarding_declaration?: boolean | null
          send_experience?: string[]
          status?: Database["public"]["Enums"]["tutor_status"]
          subjects?: string[]
          temp_password_issued?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tutor_applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_profiles: {
        Row: {
          age_groups: string[]
          application_id: string | null
          bio: string | null
          dbs_status: string | null
          exam_boards: string[]
          examiner_boards_verified: string[]
          examiner_verified: boolean
          examiner_verified_at: string | null
          experience_years: number | null
          id: string
          qualifications: string | null
          rating: number | null
          review_count: number | null
          send_experience: string[]
          status: Database["public"]["Enums"]["tutor_status"]
          subjects: string[]
          training_completed: boolean
          updated_at: string
        }
        Insert: {
          age_groups?: string[]
          application_id?: string | null
          bio?: string | null
          dbs_status?: string | null
          exam_boards?: string[]
          examiner_boards_verified?: string[]
          examiner_verified?: boolean
          examiner_verified_at?: string | null
          experience_years?: number | null
          id: string
          qualifications?: string | null
          rating?: number | null
          review_count?: number | null
          send_experience?: string[]
          status?: Database["public"]["Enums"]["tutor_status"]
          subjects?: string[]
          training_completed?: boolean
          updated_at?: string
        }
        Update: {
          age_groups?: string[]
          application_id?: string | null
          bio?: string | null
          dbs_status?: string | null
          exam_boards?: string[]
          examiner_boards_verified?: string[]
          examiner_verified?: boolean
          examiner_verified_at?: string | null
          experience_years?: number | null
          id?: string
          qualifications?: string | null
          rating?: number | null
          review_count?: number | null
          send_experience?: string[]
          status?: Database["public"]["Enums"]["tutor_status"]
          subjects?: string[]
          training_completed?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "tutor_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_training_modules: {
        Row: {
          description: string | null
          id: string
          required: boolean
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          required?: boolean
          sort_order?: number
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          required?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      tutor_training_progress: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string
          tutor_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id: string
          tutor_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "tutor_training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_training_progress_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          ai_platform_summary: string | null
          ai_tutor_summary: string | null
          generated_at: string
          id: string
          learner_id: string
          tutor_notes_summary: string | null
          week_start: string
        }
        Insert: {
          ai_platform_summary?: string | null
          ai_tutor_summary?: string | null
          generated_at?: string
          id?: string
          learner_id: string
          tutor_notes_summary?: string | null
          week_start: string
        }
        Update: {
          ai_platform_summary?: string | null
          ai_tutor_summary?: string | null
          generated_at?: string
          id?: string
          learner_id?: string
          tutor_notes_summary?: string | null
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_reteach_log: {
        Row: {
          approach_used: string
          created_at: string
          id: string
          learner_id: string
          question_id: string | null
          topic_key: string | null
        }
        Insert: {
          approach_used: string
          created_at?: string
          id?: string
          learner_id: string
          question_id?: string | null
          topic_key?: string | null
        }
        Update: {
          approach_used?: string
          created_at?: string
          id?: string
          learner_id?: string
          question_id?: string | null
          topic_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_reteach_log_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_reteach_log_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_reteach_log_topic_key_fkey"
            columns: ["topic_key"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["key"]
          },
        ]
      }
      workshop_sessions: {
        Row: {
          ended_at: string | null
          id: string
          learner_id: string
          minutes_spent: number | null
          started_at: string
          subject_key: string | null
          topic_key: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          learner_id: string
          minutes_spent?: number | null
          started_at?: string
          subject_key?: string | null
          topic_key?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          learner_id?: string
          minutes_spent?: number | null
          started_at?: string
          subject_key?: string | null
          topic_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_sessions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_sessions_subject_key_fkey"
            columns: ["subject_key"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "workshop_sessions_topic_key_fkey"
            columns: ["topic_key"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["key"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_role_type: {
        Args: never
        Returns: Database["public"]["Enums"]["role_type"]
      }
    }
    Enums: {
      mood_type:
        | "happy"
        | "okay"
        | "tired"
        | "worried"
        | "excited"
        | "frustrated"
      role_type:
        | "child"
        | "parent"
        | "tutor"
        | "school_admin"
        | "teacher"
        | "admin"
        | "safeguarding"
        | "authority"
      tutor_status:
        | "submitted"
        | "under_review"
        | "dbs_pending"
        | "contract_pending"
        | "training_pending"
        | "approved"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mood_type: ["happy", "okay", "tired", "worried", "excited", "frustrated"],
      role_type: [
        "child",
        "parent",
        "tutor",
        "school_admin",
        "teacher",
        "admin",
        "safeguarding",
        "authority",
      ],
      tutor_status: [
        "submitted",
        "under_review",
        "dbs_pending",
        "contract_pending",
        "training_pending",
        "approved",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
