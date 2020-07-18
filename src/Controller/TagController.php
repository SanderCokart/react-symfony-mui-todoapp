<?php

namespace App\Controller;

use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/tag", name="api_tag")
 */
class TagController extends AbstractController
{
    /**
     * @var TagRepository
     */
    private $tagRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(TagRepository $tagRepository, EntityManagerInterface $entityManager)
    {

        $this->tagRepository = $tagRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/read", name="api_tag_read")
     */
    public function read()
    {
        $tags = [];

        foreach ($this->tagRepository->findAll() as $tag) {
            $tags[] = $tag->normalize();
        }
        return $this->json($tags);
    }
}
