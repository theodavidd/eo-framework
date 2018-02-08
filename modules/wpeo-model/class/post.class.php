<?php
/**
 * Gestion des posts (POST, PUT, GET, DELETE)
 *
 * @author Eoxia <dev@eoxia.com>
 * @since 0.1.0
 * @version 1.0.0
 * @copyright 2015-2018
 * @package EO_Framework
 */

namespace eoxia;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( '\eoxia\Post_Class' ) ) {

	/**
	 * Gestion des posts (POST, PUT, GET, DELETE)
	 */
	class Post_Class extends Rest_Class {

		/**
		 * Le nom du modèle
		 *
		 * @var string
		 */
		protected $model_name = '\eoxia\Post_Model';

		/**
		 * Le type du post
		 *
		 * @var string
		 */
		protected $post_type = 'post';

		/**
		 * Le type du post
		 *
		 * @var string
		 */
		protected $base = 'post';

		/**
		 * La clé principale pour post_meta
		 *
		 * @var string
		 */
		protected $meta_key = '_wpeo_post';

		/**
		 * Le nom pour le resgister post type
		 *
		 * @var string
		 */
		protected $post_type_name = 'posts';

		/**
		 * Utiles pour récupérer la clé unique
		 *
		 * @todo Rien à faire ici
		 * @var string
		 */
		protected $identifier_helper = 'post';

		/**
		 * La liste des droits a avoir pour accèder aux différentes méthodes
		 *
		 * @var array
		 */
		protected $capabilities = array(
			'get'    => 'read',
			'put'    => 'edit_posts',
			'post'   => 'edit_posts',
			'delete' => 'delete_posts',
		);

		/**
		 * Fonction de callback après avoir récupérer le modèle en mode GET.
		 *
		 * @var array
		 */
		protected $after_get_function = array();

		/**
		 * Fonction de callback avant d'insérer les données en mode POST.
		 *
		 * @var array
		 */
		protected $before_post_function = array();

		/**
		 * Fonction de callback avant de dispacher les données en mode POST.
		 *
		 * @var array
		 */
		protected $before_model_post_function = array();

		/**
		 * Fonction de callback après avoir inséré les données en mode POST.
		 *
		 * @var array
		 */
		protected $after_post_function = array();

		/**
		 * Fonction de callback avant de mêttre à jour les données en mode PUT.
		 *
		 * @var array
		 */
		protected $before_put_function = array();

		/**
		 * Fonction de callback avant de dispatcher les données en mode PUT.
		 *
		 * @var array
		 */
		protected $before_model_put_function = array();

		/**
		 * Fonction de callback après avoir mis à jour les données en mode PUT.
		 *
		 * @var array
		 */
		protected $after_put_function = array();

		/**
		 * Appelle l'action "init" de WordPress
		 *
		 * @return void
		 */
		protected function construct() {
			parent::construct();

			add_action( 'init', array( $this, 'init_post_type' ) );
		}

		/**
		 * Initialise le post type selon $name et $name_singular.
		 * Initialise la taxonomy si elle existe.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 *
		 * @see register_post_type
		 * @return boolean
		 */
		public function init_post_type() {
			$args = array(
				'label' => $this->post_type_name,
			);

			$return = register_post_type( $this->post_type, $args );

			if ( ! empty( $this->attached_taxonomy_type ) ) {
				register_taxonomy( $this->attached_taxonomy_type, $this->post_type );
			}

			return $return;
		}

		/**
		 * Permet de récupérer le schéma avec les données du modèle par défault.
		 *
		 * @since 0.1.0
		 * @version 1.0.0
		 *
		 * @return Object
		 */
		public function get_schema() {
			$model_name = $this->model_name;
			$model      = new $model_name( array() );
			return $model->get_model();
		}

		/**
		 * Récupères les données selon le modèle définis.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 *
		 * @param array   $args Les paramètres de get_comments @https://codex.wordpress.org/Function_Reference/WP_Query.
		 * @param boolean $single Si on veut récupérer un tableau, ou qu'une seule entrée.
		 *
		 * @return Object
		 *
		 * @todo: ligne 128 - Temporaire
		 */
		public function get( $args = array( 'posts_per_page' => -1 ), $single = false ) {
			$use_context = ( ! empty( $args['use_context'] ) && $args['use_context'] ) ? true : false;
			if ( ! isset( $args['use_context'] ) ) {
				$use_context = true;
			}

			$req_method = 'get';

			if ( ! $use_context ) {
				$req_method = null;
			}

			$array_posts = array();

			if ( empty( $args['post_type'] ) ) {
				$args['post_type'] = $this->post_type;
			}

			if ( ! empty( $args['include'] ) ) {
				$args['post__in'] = $args['include'];
				if ( ! is_array( $args['post__in'] ) ) {
					$args['post__in'] = (array) $args['post__in'];
				}
				unset( $args['include'] );
			}

			if ( ! isset( $args['posts_per_page'] ) ) {
				$args['posts_per_page'] = -1;
			}

			if ( ! isset( $args['post_status'] ) ) {
				$args['post_status'] = 'any';
			}

			if ( isset( $args['id'] ) ) {
				$array_posts[] = get_post( $args['id'], ARRAY_A );
				unset( $args['id'] );
			} elseif ( isset( $args['schema'] ) ) {
				$array_posts[] = array();
			} else {
				$query_posts = new \WP_Query( $args );
				$array_posts = $query_posts->posts;
				unset( $query_posts->posts );
			}

			foreach ( $array_posts as $key => $post ) {
				$post = (array) $post;

				// Si post['ID'] existe, on récupère les meta.
				if ( ! empty( $post['ID'] ) ) {
					$list_meta = get_post_meta( $post['ID'] );
					foreach ( $list_meta as &$meta ) {
						$meta = array_shift( $meta );
						$meta = JSON_Util::g()->decode( $meta );
					}

					$post = array_merge( $post, $list_meta );

					if ( ! empty( $post[ $this->meta_key ] ) ) {
						$data_json = JSON_Util::g()->decode( $post[ $this->meta_key ] );
						if ( is_array( $data_json ) ) {
							$post = array_merge( $post, $data_json );
						} else {
							$post[ $this->meta_key ] = $data_json;
						}
						unset( $post[ $this->meta_key ] );
					}
				}
				$model_name          = $this->model_name;
				$array_posts[ $key ] = new $model_name( $post, $req_method );
				$array_posts[ $key ] = $this->get_taxonomies_id( $array_posts[ $key ] );

				$array_posts[ $key ] = Model_Util::exec_callback( $this->after_get_function, $array_posts[ $key ], array( 'model_name' => $model_name ) );
			} // End foreach().

			if ( true === $single && 1 === count( $array_posts ) ) {
				$array_posts = $array_posts[0];
			}

			return $array_posts;
		}

		/**
		 * Appelle la méthode update.
		 *
		 * @since 0.1.0
		 * @version 1.0.0
		 *
		 * @param  Array $data Les données.
		 * @return Array $data Les données
		 */
		public function create( $data ) {
			return $this->update( $data );
		}

		/**
		 * Insère ou met à jour les données dans la base de donnée.
		 *
		 * @since 0.1.0
		 * @version 1.0.0
		 *
		 * @param  Array $data Les données a insérer ou à mêttre à jour.
		 * @return Object      L'objet construit grâce au modèle.
		 */
		public function update( $data ) {
			$model_name = $this->model_name;
			$data       = (array) $data;
			$req_method = ( ! empty( $data['id'] ) ) ? 'put' : 'post';
			$before_cb  = 'before_' . $req_method . '_function';
			$after_cb   = 'after_' . $req_method . '_function';
			$args_cb    = array( 'model_name' => $model_name );

			if ( empty( $data['type'] ) ) {
				$data['type'] = $this->get_type();
			}

			$data = Model_Util::exec_callback( $this->$before_cb, $data, $args_cb );

			if ( ! empty( $data['id'] ) ) {
				$current_data = $this->get( array(
					'id'          => $data['id'],
					'use_context' => false,
				), true );

				$data = Array_Util::g()->recursive_wp_parse_args( $data, (array) $current_data );
			}

			if ( isset( $data['$push'] ) ) {
				if ( ! empty( $data['$push'] ) ) {
					foreach ( $data['$push'] as $field_name => $field_to_push ) {
						if ( ! empty( $field_to_push ) ) {
							foreach ( $field_to_push as $sub_field_name => $value ) {
								if ( ! isset( $data[ $field_name ][ $sub_field_name ] ) ) {
									$data[ $field_name ][ $sub_field_name ] = array();
								}

								$data[ $field_name ][ $sub_field_name ][] = $value;
							}
						}
					}
				}

				unset( $data['$push'] );
			}

			$data = new $model_name( $data, $req_method );

			if ( empty( $data->id ) ) {
				$inserted_post = wp_insert_post( $data->convert_to_wordpress(), true );
				if ( is_wp_error( $inserted_post ) ) {
					return $inserted_post;
				}

				$data->id = $inserted_post;
			} else {
				$update_state = wp_update_post( $data->convert_to_wordpress(), true );

				if ( is_wp_error( $update_state ) ) {
					return $update_state;
				}
			}

			Save_Meta_Class::g()->save_meta_data( $data, 'update_post_meta', $this->meta_key );

			// Save taxonomy!
			$this->save_taxonomies( $data );

			$data = Model_Util::exec_callback( $this->$after_cb, $data, $args_cb );

			return $data;
		}

		/**
		 * Recherche dans les meta value.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 *
		 * @param string $search Le terme de la recherche.
		 * @param array  $array  La définition de la recherche.
		 *
		 * @return array
		 */
		public function search( $search, $array ) {
			global $wpdb;

			if ( empty( $array ) || ! is_array( $array ) ) {
				return array();
			}

			$where = ' AND ( ';
			if ( ! empty( $array ) ) {
				foreach ( $array as $key => $element ) {
					if ( is_array( $element ) ) {
						foreach ( $element as $sub_element ) {
							$where .= ' AND ( ' === $where  ? '' : ' OR ';
							$where .= ' (PM.meta_key="' . $sub_element . '" AND PM.meta_value LIKE "%' . $search . '%") ';
						}
					} else {
						$where .= ' AND ( ' === $where ? '' : ' OR ';
						$where .= ' P.' . $element . ' LIKE "%' . $search . '%" ';
					}
				}
			}

			$where .= ' ) ';

			$list_group = $wpdb->get_results( "SELECT DISTINCT P.ID FROM {$wpdb->posts} as P JOIN {$wpdb->postmeta} AS PM ON PM.post_id=P.ID WHERE P.post_type='" . $this->get_post_type() . "'" . $where );
			$list_model = array();
			if ( ! empty( $list_group ) ) {
				foreach ( $list_group as $element ) {
					$list_model[] = $this->get( array(
						'id' => $element->ID,
					) );
				}
			}

			return $list_model;
		}


		/**
		 * Retourne le post type, mettre get_type de partout et supprimer get_post_type
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 *
		 * @return string Le post type
		 */
		public function get_type() {
			return $this->post_type;
		}

		/**
		 * Utile uniquement pour DigiRisk.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 *
		 * @return string L'identifiant des commentaires pour DigiRisk.
		 */
		public function get_identifier_helper() {
			return $this->identifier_helper;
		}

		/**
		 * Récupères les ID des taxonomies lié à ce post.
		 *
		 * @param  object $data L'objet courant.
		 * @return object				L'objet avec les taxonomies.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
		 */
		private function get_taxonomies_id( $data ) {
			if ( ! empty( $data->id ) ) {
				$model = $data->get_model();
				if ( ! empty( $model['taxonomy']['child'] ) ) {
					foreach ( $model['taxonomy']['child'] as $key => $value ) {
						$data->taxonomy[ $key ] = wp_get_object_terms( $data->id, $key, array(
							'fields' => 'ids',
						) );
					}
				}
			}

			return $data;
		}

		/**
		 * Sauvegardes les taxonomies
		 *
		 * @param  object $data L'objet avec les taxonomies à sauvegarder.
		 */
		private function save_taxonomies( $data ) {
			if ( ! empty( $data->taxonomy ) ) {
				foreach ( $data->taxonomy as $taxonomy_name => $taxonomy_data ) {
					if ( ! empty( $taxonomy_name ) ) {
						wp_set_object_terms( $data->id, $taxonomy_data, $taxonomy_name, true );
					}
				}
			}
		}

		/**
		 * Permet de changer le modèle en dur.
		 *
		 * @param string $model_name Le nom du modèle.
		 *
		 * @since 1.0.0
		 * @version 1.3.6.0
		 */
		public function set_model( $model_name ) {
			$this->model_name = $model_name;
		}
	}
} // End if().
