<?php
/**
 * Définition des données des commentaires
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

if ( ! class_exists( '\eoxia\Comment_Model' ) ) {
	/**
	 * Définition des données des commentaires
	 */
	class Comment_Model extends Data_Class {

		/**
		 * Définition du modèle principal des commentaires
		 *
		 * @var array Les champs principaux des commentaires
		 */
		protected $schema = array();

		/**
		 * Le constructeur
		 *
		 * @since 0.1.0
		 * @version 1.0.0
		 *
		 * @param array $data       Les données de l'objet.
		 * @param mixed $req_method Peut être "GET", "POST", "PUT" ou null.
		 */
		public function __construct( $data = null, $req_method = null ) {
			$this->schema['id'] = array(
				'type'  => 'integer',
				'field' => 'comment_ID',
			);

			$this->schema['parent_id'] = array(
				'type'  => 'integer',
				'field' => 'comment_parent',
			);

			$this->schema['post_id'] = array(
				'type'     => 'integer',
				'field'    => 'comment_post_ID',
				'required' => true,
			);

			$this->schema['date'] = array(
				'type'  => 'wpeo_date',
				'field' => 'comment_date',
			);

			$this->schema['author_id'] = array(
				'type'  => 'integer',
				'field' => 'user_ID',
			);

			$this->schema['author_nicename'] = array(
				'type'  => 'string',
				'field' => 'comment_author',
			);

			$this->schema['author_email'] = array(
				'type'  => 'string',
				'field' => 'comment_author_email',
			);

			$this->schema['author_url'] = array(
				'type'  => 'string',
				'field' => 'comment_author_url',
			);

			$this->schema['author_ip'] = array(
				'type'  => 'string',
				'field' => 'comment_author_IP',
			);

			$this->schema['content'] = array(
				'type'     => 'string',
				'field'    => 'comment_content',
				'required' => true,
			);

			$this->schema['status'] = array(
				'type'  => 'string',
				'field' => 'comment_approved',
			);

			$this->schema['type'] = array(
				'type'     => 'string',
				'field'    => 'comment_type',
				'required' => true,
			);

			parent::__construct( $data, $req_method );
		}
	}
} // End if().
